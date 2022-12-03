require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_LIVE_KEY);
const express = require("express");
const cors = require("cors");
const serverless = require("serverless-http");

const app = express();
const router = express.Router();

app.use(express.json());
app.use(
  cors({
    origin: `${process.env.CLIENT_URL}`,
  })
);

const priceList = {
  f22ro: {
    XS: "price_1M6e3WDWw7KIDNJZnJfoRpzA",
    S: "price_1M6e40DWw7KIDNJZ2SaTkRDl",
    M: "price_1M6e4LDWw7KIDNJZdxbAqv9E",
    L: "price_1M6e4iDWw7KIDNJZM4HTvXAb",
    XL: "price_1M6e55DWw7KIDNJZ1xlNEJBI",
    XXL: "price_1M6e5PDWw7KIDNJZiWLNbY8r",
  },
  f22s: {
    XS: "price_1M6e5jDWw7KIDNJZiQCLV0Dt",
    S: "price_1M6e63DWw7KIDNJZvU0dR5MP",
    M: "price_1M6e91DWw7KIDNJZUgNfH8sN",
    L: "price_1M6e9TDWw7KIDNJZ6GL2wMIk",
    XL: "price_1M6e9sDWw7KIDNJZJ3JUqR1I",
    XXL: "price_1M6eADDWw7KIDNJZ1qoBVeDK",
  },
  f22lwu: {
    XS: "price_1M6eAWDWw7KIDNJZg56xkLHx",
    S: "price_1M6eBCDWw7KIDNJZ0k4WUapa",
    M: "price_1M6eBXDWw7KIDNJZPgr4hNu2",
    L: "price_1M6eBrDWw7KIDNJZh1cR7tKR",
    XL: "price_1M6eCFDWw7KIDNJZ0v2RNIed",
    XXL: "price_1M6eD7DWw7KIDNJZd9Xw3JIt",
  },
  test: {
    X: "price_1M6iTyDWw7KIDNJZVBLoHe2I",
  },
};

router.post("/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      shipping_address_collection: { allowed_countries: ["CZ", "SK"] },
      shipping_options: [
        { shipping_rate: "shr_1M63enDWw7KIDNJZ2ElqyftD" },
        { shipping_rate: "shr_1M63erDWw7KIDNJZ8dsT7wL2" },
      ],
      phone_number_collection: {
        enabled: true,
      },
      line_items: req.body.items.map((item) => ({
        price: priceList[item.id][item.size],
        quantity: item.quantity,
      })),
      success_url: `${process.env.CLIENT_URL}/success/index.html`,
      cancel_url: `${process.env.CLIENT_URL}`,
    });
    res.json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/", (req, res) => {
  res.json({
    status: "live",
    process: "serving-stripe",
  });
});

app.use("/.netlify/functions/api", router);

module.exports.handler = serverless(app);
