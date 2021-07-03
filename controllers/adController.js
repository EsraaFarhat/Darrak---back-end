const { Advertisement } = require("../models/advertisement");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.createAd = async (req, res, next) => {
  // console.log("req.body.address", req.body.address);
  const advertisement = new Advertisement({
    images: req.body.images,
    address: req.body.address,
    price: req.body.price,
    internet: req.body.internet,
    owner: req.user._id,
    publishedAt: Date.now(),
    apartmentArea: req.body.apartmentArea,
    noOfRooms: req.body.noOfRooms,
    description: req.body.description,
    location: req.body.location,
  });

  const createAdvertisement = await advertisement.save();
  if (createAdvertisement) {
    // req.ad = createAdvertisement.id;
    req.ad = createAdvertisement;
    // console.log("removing Ad");
    // createAdvertisement.remove();
    return next();
    // return res.status(201).send({
    //   message: "new advertisement created",
    //   data: createAdvertisement,
    // });
  }
  return res.status(500).send({ message: " Error in Creating Advertisement." });
};

exports.getCheckoutSession = async (req, res, next) => {
  try {
    // 1) Get the currently booked tour
    // console.log(req.ad);
    const ad = req.ad;
    console.log("ad.id = ", req.ad.id);

    // 2) Create checkout session
    // console.log("ad.price * 0.1 = ", ad.price * 0.1);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      // success_url: `${req.protocol}://${req.get("host")}/home?ad=${
      //   req.ad
      // }&user=${req.user.id}`,
      // success_url: `http://localhost:3001/advertisment/${req.ad}`,
      // success_url: `${req.protocol}://${req.get("host")}/my-tours?alert=booking`,
      // cancel_url: `http://localhost:3001/add-advertisment`,
      // cancel_url: `${req.protocol}://${req.get("host")}/add-advertisment`,

      success_url: `https://darrak.netlify.app/advertisment/${req.ad}`,
      cancel_url: `https://darrak.netlify.app/add-advertisment`,

      customer_email: req.user.email,
      client_reference_id: ad.id,
      line_items: [
        {
          name: ad.apartmentArea,
          description: ad.description,
          images: [ad.images[0]],
          amount: ad.price * 10,
          currency: "EGP",
          quantity: 1,
        },
      ],
    });
    // const stripe = require('stripe')('sk_test_51J4naQKfRhAt2voDGf4Cwy6JMi8UehEes8jBrNygdcZ7GbFfwEH6zFLgagk7vFaigxQAU40sF7mndYZmCylFhL2i00NY8gQJAK');
    // const express = require('express');
    // const app = express();
    // app.use(express.static('.'));

    // const YOUR_DOMAIN = 'http://localhost:4242';

    // app.post('/create-checkout-session', async (req, res) => {
    //   const session = await stripe.checkout.sessions.create({
    //     payment_method_types: ['card'],
    //     line_items: [
    //       {
    //         price_data: {
    //           currency: 'usd',
    //           product_data: {
    //             name: 'Stubborn Attachments',
    //             images: ['https://i.imgur.com/EHyR2nP.png'],
    //           },
    //           unit_amount: 2000,
    //         },
    //         quantity: 1,
    //       },
    //     ],
    //     mode: 'payment',
    //     success_url: `${YOUR_DOMAIN}/success.html`,
    //     cancel_url: `${YOUR_DOMAIN}/cancel.html`,
    //   });

    //   res.json({ id: session.id });
    // });

    // app.listen(4242, () => console.log('Running on port 4242'));
    // 3) Create session as response
    res.status(200).json({
      status: "success",
      session,
    });
  } catch (e) {
    // console.log("e = ", e);
    res.status(400).json({
      status: "failed",
      e,
    });
  }
};

// exports.makeHiddenAdFalse = async (req, res, next) => {
//   // This is only TEMPORARY, because it's UNSECURE: everyone can make bookings without paying
//   const { ad } = req.query;

//   if (!ad) return next();

//   const newAd = await Advertisement.findByIdAndUpdate(
//     ad,
//     { hidden: "false" },
//     { new: true }
//   );
//   console.log("newAd = ", newAd);

//   res.redirect(req.originalUrl.split("?")[0]);
// };

const createAdCheckout = async (session) => {
  console.log("session.client_reference_id = ", session.client_reference_id);

  const advertisement = await Advertisement.findById(
    session.client_reference_id
  ).populate("owner");
  advertisement.hidden = false;
  console.log("advertisement.hidden = ", advertisement.hidden);
  await advertisement.save();
};

exports.webhookCheckout = (req, res, next) => {
  const signature = req.headers["stripe-signature"];
  console.log("in webhookCheckout");
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }
  console.log("if (event.type === 'checkout.session.completed')");
  if (event.type === "checkout.session.completed")
    createAdCheckout(event.data.object);

  res.status(200).json({ received: true });
};
