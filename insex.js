import express from "express";
import dotenv from "dotenv";
import razorpay from "razorpay";

dotenv.config();
const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/order", async (req, res) => {
  const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  const options = {
    amount: req.body.amount,
    currency: req.body.currency,
    receipt: "receipt#1",
    payment_capture: 0,
  };
  try {
    const response = await razorpayInstance.orders.create(options);
    res.json({
      id: response.id,
      currency: response.currency,
      amount: response.amount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

app.get("/order/:id", async (req, res) => {
  const { id } = req.params;
  const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  try {
    const response = await razorpayInstance.orders.fetch(id);
    if (!response) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
