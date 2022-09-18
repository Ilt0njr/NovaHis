import Stripe from "stripe";

export default async (req, res) => {
  if (req.method === "POST") {
    const stripe = new Stripe(process.env.STRIPE_PRIVATEKEY);
    const items = [];
    for (const item of req.body.items) {
      const response = await stripe.checkout.sessions.retrieve(item);
      items.push(response);
      console.log(items);
    }
    res.status(200).json({ items });
  }
};
