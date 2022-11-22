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

function fillCheckout(item) {
  switch (item.id) {
    case "f22ro":
      if (item.size === "XS") {
        return "price_1M6e32DWw7KIDNJZrqym1glO";
      } else if (item.size === "S") {
        return "price_1M6e3rDWw7KIDNJZeAUwPKeV";
      } else if (item.size === "M") {
        return "price_1M6e4FDWw7KIDNJZatfGbWhH";
      } else if (item.size === "L") {
        return "price_1M6e4ZDWw7KIDNJZkmXouKR0";
      } else if (item.size === "XL") {
        return "price_1M6e4yDWw7KIDNJZ7ctz0kuR";
      } else {
        return "price_1M6e5GDWw7KIDNJZfrR3MQld";
      }
    case "f22s":
      if (item.size === "XS") {
        return "price_1M6e5ZDWw7KIDNJZ1LRirZCN";
      } else if (item.size === "S") {
        return "price_1M6e5xDWw7KIDNJZsSdyv8h9";
      } else if (item.size === "M") {
        return "price_1M6e8FDWw7KIDNJZ1EPdBp56";
      } else if (item.size === "L") {
        return "price_1M6e9MDWw7KIDNJZy5KZAmRV";
      } else if (item.size === "XL") {
        return "price_1M6e9jDWw7KIDNJZIVF8w45i";
      } else if (item.size === "XXL") {
        return "price_1M6eA7DWw7KIDNJZVI5pc9jl";
        //test item
      } else {
        return "price_1M6iTyDWw7KIDNJZVBLoHe2I";
      }
    case "f22lwu":
      if (item.size === "XS") {
        return "price_1M6eAQDWw7KIDNJZEV2IBGUR";
      } else if (item.size === "S") {
        return "price_1M6eB4DWw7KIDNJZPPsPtqbA";
      } else if (item.size === "M") {
        return "price_1M6eBQDWw7KIDNJZkXrfn3Xw";
      } else if (item.size === "L") {
        return "price_1M6eBlDWw7KIDNJZnEu2XOh1";
      } else if (item.size === "XL") {
        return "price_1M6eC8DWw7KIDNJZYdXMU8N2";
      } else {
        return "price_1M6eCgDWw7KIDNJZHg78Pl3M";
      }
  }
}

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
        price: `${fillCheckout(item)}`,
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
