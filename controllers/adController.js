const { Advertisement } = require("../models/advertisement");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.createAd = async (req, res, next) => {
  console.log("req.body.address", req.body.address);
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
  });

  const createAdvertisement = await advertisement.save();
  if (createAdvertisement) {
    req.ad = createAdvertisement.id;
    // console.log("req.ad", req.ad);
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
    const ad = await Advertisement.findById(req.ad);
    console.log("ad = ", ad);

    // 2) Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      // success_url: `${req.protocol}://${req.get("host")}/home?ad=${
      //   req.ad
      // }&user=${req.user.id}`,
      success_url: `http://localhost:3001/home?ad=${req.ad}`,
      // success_url: `${req.protocol}://${req.get("host")}/my-tours?alert=booking`,
      cancel_url: `http://localhost:3001/add-advertisment`,
      // cancel_url: `${req.protocol}://${req.get("host")}/add-advertisment`,

      customer_email: req.user.email,
      // client_reference_id: req.params.tourId,
      line_items: [
        {
          name: ad.apartmentArea,
          description: ad.description,
          images: [ad.images[0]],
          amount: ad.price * 0.1,
          currency: "usd",
          quantity: 1,
        },
      ],
    });

    // 3) Create session as response
    res.status(200).json({
      status: "success",
      session,
    });
  } catch (e) {
    console.log("e = ", e);
    res.status(400).json({
      status: "failed",
      e,
    });
  }
};
