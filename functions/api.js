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
        return "price_1M5PYvDWw7KIDNJZLbcIFA7u";
      } else if (item.size === "S") {
        return "price_1M5PZZDWw7KIDNJZlPgYngC0";
      } else if (item.size === "M") {
        return "price_1M5PZiDWw7KIDNJZk4pg0NV4";
      } else if (item.size === "L") {
        return "price_1M5PZvDWw7KIDNJZHPVlipDI";
      } else if (item.size === "XL") {
        return "price_1M5Pa2DWw7KIDNJZuw2vIpeN";
      } else {
        return "price_1M5Pa8DWw7KIDNJZlpEWwTCt";
      }
    case "f22s":
      if (item.size === "XS") {
        return "price_1M5PaRDWw7KIDNJZj7aNTU0S";
      } else if (item.size === "S") {
        return "price_1M5PaZDWw7KIDNJZuUTF4uqG";
      } else if (item.size === "M") {
        return "price_1M5PawDWw7KIDNJZP6LXwqqT";
      } else if (item.size === "L") {
        return "price_1M5Pb6DWw7KIDNJZ3AhK6FJi";
      } else if (item.size === "XL") {
        return "price_1M5PbDDWw7KIDNJZcuTJqlCc";
      } else {
        return "price_1M5PbJDWw7KIDNJZ3pzYjXQu";
      }
    case "f22lwu":
      if (item.size === "XS") {
        return "price_1M5PbiDWw7KIDNJZaOoVUSlJ";
      } else if (item.size === "S") {
        return "price_1M5PbnDWw7KIDNJZqSbWPAm7";
      } else if (item.size === "M") {
        return "price_1M5PbwDWw7KIDNJZt0rIAKnG";
      } else if (item.size === "L") {
        return "price_1M5Pc8DWw7KIDNJZGDB3ar3j";
      } else if (item.size === "XL") {
        return "price_1M5PcDDWw7KIDNJZJjBSWT6E";
      } else {
        return "price_1M5PcIDWw7KIDNJZkswB1j6q";
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
