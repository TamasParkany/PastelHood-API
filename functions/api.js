require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const express = require("express");
const cors = require("cors");
const serverless = require("serverless-http");

const app = express();
const router = express.Router();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5500",
  })
);

function fillCheckout(item) {
  switch (item.id) {
    case "f22ro":
      if (item.size === "XS") {
        return "price_1M5G0vDWw7KIDNJZRiNQvriZ";
      } else if (item.size === "S") {
        return "price_1M5G1iDWw7KIDNJZjggF6Mzs";
      } else if (item.size === "M") {
        return "price_1M5Ey9DWw7KIDNJZwcrCrJpT";
      } else if (item.size === "L") {
        return "price_1M5G2pDWw7KIDNJZK2O7mAJK";
      } else if (item.size === "XL") {
        return "price_1M5G3DDWw7KIDNJZzZ8FukqC";
      } else {
        return "price_1M5G3UDWw7KIDNJZ4dcVxzCR";
      }
    //NOOOOOOOOOOOOOOOOOOOOOOOOOO
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
        { shipping_rate: "shr_1M61pDDWw7KIDNJZulhJ1DXZ" },
        { shipping_rate: "shr_1M61plDWw7KIDNJZK3nAnA7f" },
      ],
      phone_number_collection: {
        enabled: true,
      },
      line_items: req.body.items.map((item) => ({
        price: `${fillCheckout(item)}`,
        quantity: item.quantity,
      })),
      success_url: `${process.env.CLIENT_URL}/success.html`,
      cancel_url: `${process.env.CLIENT_URL}/cancel.html`,
    });
    res.json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/status", (req, res) => {
  res.json({
    status: "live",
  });
});

app.use("/.netlify/functions/api", router);

module.exports.handler = serverless(app);
