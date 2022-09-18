import Stripe from "stripe";

export default async (req, res) => {
  if (req.method === "POST") {
    const stripe = new Stripe(process.env.STRIPE_PRIVATEKEY);
    const items = [];

    for (const item of req.body.items) {
      const response = await stripe.products.retrieve(item);
      items.push(response);
    }
    res.status(200).json({ items });
  }
};
