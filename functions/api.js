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
    XS: "price_1M6e32DWw7KIDNJZrqym1glO",
    S: "price_1M6e3rDWw7KIDNJZeAUwPKeV",
    M: "price_1M6e4FDWw7KIDNJZatfGbWhH",
    L: "price_1M6e4ZDWw7KIDNJZkmXouKR0",
    XL: "price_1M6e4yDWw7KIDNJZ7ctz0kuR",
    XXL: "price_1M6e5GDWw7KIDNJZfrR3MQld",
  },
  f22s: {
    XS: "price_1M6e5ZDWw7KIDNJZ1LRirZCN",
    S: "price_1M6e5xDWw7KIDNJZsSdyv8h9",
    M: "price_1M6e8FDWw7KIDNJZ1EPdBp56",
    L: "price_1M6e9MDWw7KIDNJZy5KZAmRV",
    XL: "price_1M6e9jDWw7KIDNJZIVF8w45i",
    XXL: "price_1M6eA7DWw7KIDNJZVI5pc9jl",
  },
  f22lwu: {
    XS: "price_1M6eAQDWw7KIDNJZEV2IBGUR",
    S: "price_1M6eB4DWw7KIDNJZPPsPtqbA",
    M: "price_1M6eBQDWw7KIDNJZkXrfn3Xw",
    L: "price_1M6eBlDWw7KIDNJZnEu2XOh1",
    XL: "price_1M6eC8DWw7KIDNJZYdXMU8N2",
    XXL: "price_1M6eCgDWw7KIDNJZHg78Pl3M",
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
