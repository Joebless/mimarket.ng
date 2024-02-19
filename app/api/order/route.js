import User from "@models/User";
import { connectToDB } from "@mongodb/database";

const stripe = require("stripe")(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

async function getCartItems(lineItems) {
  const cartItems = await Promise.all(
    lineItems?.data?.map(async (item) => {
      const product = await stripe.products.retrieve(item.price.product);
      const productId = product.metadata.productId;

      return {
        productId,
        title: product.name,
        price: item.price.unit_amount_decimal / 100,
        quantity: item.quantity,
        image: product.images[0],
      };
    })
  );

  return cartItems;
}

async function handleCheckoutCompleted(event) {
  const session = event.data.object;
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

  const orderItems = await getCartItems(lineItems);
  const userId = session.client_reference_id;
  const amountPaid = session.amount_total / 100;

  const orderData = {
    id: session.payment_intent,
    user: userId,
    orderItems,
    amountPaid,
  };

  await connectToDB();
  const user = await User.findById(userId);
  user.cart = [];
  user.orders.push(orderData);
  await user.save();

  return orderData;
}

export const POST = async (req, res) => {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("stripe-signature");

    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === "checkout.session.completed") {
      const orderData = await handleCheckoutCompleted(event);
      return new Response(JSON.stringify({ received: true, orderData }), {
        status: 200,
      });
    }
  } catch (err) {
    console.error(err);
    return new Response("Failed to create order", { status: 500 });
  }
};
