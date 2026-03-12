# 🛠️ CNC Marketplace — What We Can Add from yt-backend Learnings

> Your CNC project already has: Helmet · Morgan · HPP · Rate Limiting · Mongo Sanitize · Graceful Shutdown · Env Validation · Global Error Handler
> 
> This document covers what can be **added or upgraded** for a production-grade app.

---

## 1. 📋 Winston — Structured Production Logger
**Replace `console.log` / `console.error` with Winston**

### Why?
- `console.log` has no log levels (info, warn, error)
- Logs go nowhere in production — you can't filter, query, or export them
- Winston writes to **files + console**, with timestamps and severity

### Install
```bash
npm install winston
```

### Create `src/config/logger.js`
```js
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    process.env.NODE_ENV === 'production'
      ? winston.format.json()          // machine-readable in prod
      : winston.format.prettyPrint()   // human-readable in dev
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ],
});

module.exports = logger;
```

### Usage — Replace `console.error` in [app.js](file:///c:/Users/hp/Desktop/CNC-Designe/backend/src/app.js) (line 187)
```js
// ❌ CURRENT
console.error('Unhandled Server Error 💥:', err);

// ✅ WITH WINSTON
const logger = require('./config/logger');
logger.error({ message: err.message, stack: err.stack, url: req.originalUrl });
```

### Usage — Replace `console.log` in [server.js](file:///c:/Users/hp/Desktop/CNC-Designe/backend/src/server.js)
```js
// ❌ CURRENT
console.log(`🚀 App running on port ${PORT}...`);

// ✅
logger.info(`Server started on port ${PORT} [${process.env.NODE_ENV}]`);
```

---

## 2. ⚡ Redis — In-Memory Caching
**Cache popular/category design listings to avoid repeated DB queries**

### Why?
- `GET /api/v1/designs?sort=popular` hits MongoDB on EVERY request
- Redis caches the response for 5 minutes — zero DB queries for repeated traffic
- Reduces 300ms DB query → ~2ms cache hit

### Install
```bash
npm install ioredis
```

### Create `src/config/redis.js`
```js
const Redis = require('ioredis');

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

redis.on('connect', () => console.log('✅ Redis connected'));
redis.on('error', (err) => console.warn('⚠️ Redis error (non-fatal):', err.message));

module.exports = redis;
```

### Cache middleware for design listings
```js
// src/middlewares/cache.middleware.js
const redis = require('../config/redis');

const cacheDesigns = async (req, res, next) => {
  const key = `designs:${JSON.stringify(req.query)}`;
  try {
    const cached = await redis.get(key);
    if (cached) return res.json(JSON.parse(cached));
  } catch (_) {} // cache miss is non-fatal
  
  // Intercept res.json to save to cache
  const originalJson = res.json.bind(res);
  res.json = (data) => {
    redis.setex(key, 300, JSON.stringify(data)).catch(() => {}); // 5min TTL
    return originalJson(data);
  };
  next();
};

module.exports = { cacheDesigns };
```

### Apply in [design.routes.js](file:///c:/Users/hp/Desktop/CNC-Designe/backend/src/routes/design.routes.js)
```js
const { cacheDesigns } = require('../middlewares/cache.middleware');
router.get('/', cacheDesigns, designController.getAllDesigns);
```

> **Note**: Need a Redis instance. Use [Railway Redis](https://railway.app) (free) or [Upstash](https://upstash.com) (free serverless Redis).

---

## 3. 🗜️ Response Compression
**Compress all API responses — reduces bandwidth by 60-80%**

### Install
```bash
npm install compression
```

### Add to [app.js](file:///c:/Users/hp/Desktop/CNC-Designe/backend/src/app.js) (before routes)
```js
const compression = require('compression');

// Compress responses > 1kb
app.use(compression({
  level: 6,          // balance between speed and compression
  threshold: 1024,   // only compress if > 1kb
}));
```

> Especially effective for the design listing endpoint which returns many objects.

---

## 4. 🔒 Refresh Token System (like yt-backend)
**Add proper access token + refresh token auth (currently only access token)**

### Why?
- Current: 7-day JWT → if stolen, attacker has 7 days
- Better: 15-min access token + 7-day refresh token in httpOnly cookie
- A stolen access token is only valid for 15 minutes

### Add to [User.model.js](file:///c:/Users/hp/Desktop/CNC-Designe/backend/src/models/User.model.js)
```js
refreshToken: {
  type: String,
  select: false,
},
```

### Add to [auth.service.js](file:///c:/Users/hp/Desktop/CNC-Designe/backend/src/services/auth.service.js)
```js
exports.generateTokens = (userId) => ({
  accessToken: jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '15m' }),
  refreshToken: jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' }),
});

exports.rotateRefreshToken = async (incomingToken) => {
  const decoded = jwt.verify(incomingToken, process.env.JWT_REFRESH_SECRET);
  const user = await User.findById(decoded.id).select('+refreshToken');
  if (!user || user.refreshToken !== incomingToken) throw new Error('Invalid refresh token');
  
  const { accessToken, refreshToken } = exports.generateTokens(user._id);
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
};
```

### New route: `POST /api/v1/auth/refresh`
```js
router.post('/refresh', authController.refreshToken);
```

---

## 5. 📊 Morgan → Write Logs to File in Production
**Currently Morgan only logs to console. Add file logging.**

### Update [app.js](file:///c:/Users/hp/Desktop/CNC-Designe/backend/src/app.js)
```js
const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });

if (process.env.NODE_ENV === 'production') {
  const accessLogStream = fs.createWriteStream(
    path.join(logsDir, 'access.log'),
    { flags: 'a' } // append mode
  );
  app.use(morgan('combined', { stream: accessLogStream }));
} else {
  app.use(morgan('dev'));
}
```

---

## 6. 🏥 Improved Health Check Endpoint
**Add database + storage status to health check**

### Update [app.js](file:///c:/Users/hp/Desktop/CNC-Designe/backend/src/app.js) health route
```js
const mongoose = require('mongoose');

app.get('/api/health', async (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  
  res.status(dbState === 1 ? 200 : 503).json({
    status: dbState === 1 ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    database: dbStatus[dbState],
    environment: process.env.NODE_ENV,
  });
});
```

> Deploy monitoring tools (UptimeRobot, BetterStack) ping this endpoint every 5 min.

---

## 7. 📜 Download History Tracking
**Track what each user downloaded and when — like yt-backend's watchHistory**

### Add to [User.model.js](file:///c:/Users/hp/Desktop/CNC-Designe/backend/src/models/User.model.js)
```js
downloadHistory: [{
  design: { type: mongoose.Schema.ObjectId, ref: 'Design' },
  downloadedAt: { type: Date, default: Date.now }
}],
```

### Update [download.service.js](file:///c:/Users/hp/Desktop/CNC-Designe/backend/src/services/download.service.js)
```js
// After generating signed URL, record the download
await User.findByIdAndUpdate(user._id, {
  $push: {
    downloadHistory: {
      $each: [{ design: design._id }],
      $slice: -100, // Keep last 100 downloads only
    }
  },
  $inc: { 'stats.totalDownloads': 1 } // optional stats field
});

// Also increment the design's download counter
await Design.findByIdAndUpdate(design._id, { $inc: { downloads: 1 } });
```

### New route: `GET /api/v1/auth/download-history`
```js
exports.getDownloadHistory = async (req, res) => {
  const user = await User.findById(req.user.id)
    .populate('downloadHistory.design', 'title previewImages price');
  successResponse(res, 200, { history: user.downloadHistory });
};
```

---

## 8. ✅ Input Validation with Zod
**Replace manual `if (!field)` checks with schema-driven validation**

### Install
```bash
npm install zod
```

### Create `src/validators/design.validator.js`
```js
const { z } = require('zod');

const createDesignSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(2000),
  price: z.coerce.number().min(0).max(100000),
  category: z.enum(['3d-designs', '2d-designs', '3d-doors-design', '2d-grill-designs', '2d-door-designs', 'temple-designs', '3d-traditional', 'other']),
});

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.errors[0].message });
  }
  req.body = result.data; // sanitized data
  next();
};

module.exports = { createDesignSchema, validate };
```

### Apply in router
```js
const { createDesignSchema, validate } = require('../validators/design.validator');
router.post('/', protect, isAdmin, validate(createDesignSchema), designController.createDesign);
```

---

## 9. 🧹 Graceful Shutdown — Add SIGTERM Handler
**Currently [server.js](file:///c:/Users/hp/Desktop/CNC-Designe/backend/src/server.js) only handles `unhandledRejection`. Add proper SIGTERM for cloud deploys.**

```js
// Add to server.js after app.listen(...)
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(async () => {
    await mongoose.connection.close();
    logger.info('MongoDB connection closed. Process exiting.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  // Ctrl+C in development
  server.close(() => process.exit(0));
});
```

---

## 10. 🔔 Webhook for Stripe Payment (Stripe's `checkout.session.completed`)
**Stripe needs a webhook endpoint to confirm payments server-side**

### Add route
```js
// Must use raw body for Stripe signature verification
router.post('/webhook', express.raw({ type: 'application/json' }), paymentController.handleStripeWebhook);
```

### Controller
```js
exports.handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    // Fulfill the order using session.metadata.designIds and session.metadata.userId
    await paymentService.fulfillOrder(session);
  }

  res.json({ received: true });
};
```

> This is the **correct** way to confirm Stripe payments — more secure than relying only on the redirect URL.

---

## 📦 Summary — What to Install

| Package | Command | Priority |
|---|---|---|
| `winston` | `npm install winston` | 🟠 High |
| `compression` | `npm install compression` | 🟠 High |
| `ioredis` | `npm install ioredis` | 🟡 Medium |
| `zod` | `npm install zod` | 🟡 Medium |

## 🎯 Recommended Implementation Order

1. **`compression`** — 1 line of code, instant 60% bandwidth reduction
2. **`winston`** — Replace all `console.error` calls, add file logging
3. **Improved health check** — Required for deployment monitoring
4. **Graceful shutdown** — Required for clean deploys on Railway/Render
5. **Download history** — Great UX addition, users can re-download
6. **`zod` validation** — Eliminates all ad-hoc field checks
7. **Stripe webhook** — Makes payments bulletproof
8. **Redis caching** — Add when traffic grows (needs paid Redis)
9. **Refresh tokens** — Security upgrade when you have sustained users
