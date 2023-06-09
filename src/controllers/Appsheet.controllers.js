const payCtrl = {};
const Stripe = require("stripe");
const fetch = require("node-fetch");
const moment = require("moment-timezone");
const stripe = Stripe(process.env.LLAVE_SECRETA_STRIPE);

payCtrl.createProduct = async (req, res) => {
  try {
    const { name, amount, currency } = req.body;
    console.log(req.body);
    if (!name || !amount || !currency) {
      res
        .status(400)
        .json({
          error: true,
          message: "Faltan campos obligatorios",
          data: null,
        });
    }
    const item_stripe = await stripe.products.create({
      name,
      default_price_data: {
        unit_amount: Math.round(100 * parseFloat(amount)),
        currency,
      },
    });
    const data = {
      item_stripe,
      fecha: moment().tz("America/Mexico_City").format(),
      user: "Diego Leon"
    }

    res.status(200).json({ data, error: false, message: "Success" });
  } catch (error) {
    res.status(505).json({ message: error.message, error: true, data: null });
    console.log(error);
  }
};

/* payCtrl.createPay = async (req, res) => {
  try {
    const {
      idStripe,
      courses,
      username,
      idUser,
      total,
      typePay,
    } = req.body;
    const newPay = new modelPay({
      stripeObject: idStripe.id,
      idUser: idUser,
      nameUser: username,
      typePay: typePay,
      statusPay: false,
      total: total,
      amount: Math.round(100 * parseFloat(total)),
      courses: courses
    });
    await newPay.save((err, userStored) => {
      if (err) {
        res.status(500).json({ message: "Ups, algo paso", err });
      } else {
        if (!userStored) {
          res.status(404).json({ message: "Error" });
        } else {
          res
            .status(200)
            .json({ message: "Todo correcto", idPay: userStored._id });
        }
      }
    });
  } catch (error) {
    res.status(505).json({ message: "Error del servidor", error });
    console.log(error);
  }
}; */

/* payCtrl.confirmPay = async (req, res) => {
  try {
    const { movil = false } = req.body;
    const payBase = await modelPay.findById(req.params.idPay);
    const stripe = new Stripe(process.env.LLAVE_SECRETA_STRIPE);
    if (payBase) {
      let payment = null;
      if(movil){
        payment = await stripe.charges.create({
          amount: payBase.amount,
          currency: 'mxn',
          description: JSON.stringify(payBase._id),
          source: payBase.stripeObject,
        });
      }else{
        payment = await stripe.paymentIntents.create({
          amount: payBase.amount,
          currency: "MXN",
          description: JSON.stringify(payBase._id),
          payment_method_types: ["card"],
          payment_method: payBase.stripeObject,
          confirm: true,
        });
      }
      if (payment) {
        await modelPay.findByIdAndUpdate(
          payBase._id,
          { statusPay: true, triedPayment: payment.id },
          async (err, postStored) => {
            if (err) {
              res.status(500).json({ message: "Error al crear el pago." });
            } else {
              if (!postStored) {
                res.status(500).json({ message: "Error al crear el pago." });
              } else {
                const cartUser = await modelCart.findOne({
                  idUser: payBase.idUser,
                });
                const user_bd = await modelUser.findById(payBase.idUser);
                payBase.courses.map(async (course) => {
                  const curso_bd = await modelCourse.findById(course.idCourse);
                  const inscriptionBase = await modelInscription.findOne({idCourse: course.idCourse, idUser: payBase.idUser});
                  if(!inscriptionBase){
                    const newInscription = new modelInscription({
                      idCourse: course.idCourse,
                      idUser: payBase.idUser,
                      codeKey: "",
                      code: false,
                      priceCourse: course.priceCourse,
                      freeCourse: false,
                      promotionCourse: course.pricePromotionCourse,
                      persentagePromotionCourse: course.persentagePromotion,
                      studentAdvance: "0",
                      ending: false,
                      numCertificate: reuserFunction.generateNumCertifictate(10),
                      coupon_discount: course.coupon_discount ? course.coupon_discount : null
                    });
                    await newInscription.save();
                    if(curso_bd.startMessage){
                      await payCtrl.createSendEmailStart(user_bd, curso_bd);
                    }
                  }
                });
                for(z=0; z < payBase.courses.length; z++){
                  for(i=0; i < cartUser.courses.length; i++){
                    if (JSON.stringify(payBase.courses[z].idCourse) === JSON.stringify(cartUser.courses[i].course)) {
                      await modelCart.updateOne(
                        {
                          _id: cartUser._id,
                        },
                        {
                          $pull: {
                            courses: {
                              _id: cartUser.courses[i]._id,
                            },
                          },
                        }
                      );
                    }
                  }
                }
                res.status(200).json({ message: "Pago realizado" });
              }
            }
          }
        );
      } else {
        res.status(500).json({ message: "No se pudo procesar el pago." });
      }
    } else {
      res.status(404).json({ message: "Pago inexistente." });
    }
  } catch (error) {
    res.status(505).json({ message: "Error del servidor", error });
    console.log(error);
  }
}; */

/* payCtrl.getPay = async (req,res) => {
  try {
    await modelPay.findById(req.params.idPay, async (err, courses) => {
      if(err){
				res.status(505).json({ message: 'Ups, algo paso', err });
			}else{
        if(!courses){
          res.status(505).json({ message: 'Ups, algo paso', err });
        }else{
          await modelCourse.populate(courses, {path: 'courses.idCourse'}, async  function(err2, populatedTransactions) {
            // Your populated translactions are inside populatedTransactions
            if(err2){
              res.status(505).json({ message: 'Ups, algo paso', err2 });
            }else{
              await modelUser.populate(populatedTransactions, {path: 'courses.idCourse.idProfessor'}, async function(err3, populatedTransactions2) {
                // Your populated translactions are inside populatedTransactions
                if(err3){
                  res.status(505).json({ message: 'Ups, algo paso', err3 });
                }else{
                  res.status(200).json(populatedTransactions2.courses);
                }
              });
            }
          });
        }
			}			
    });
  } catch (error) {
    res.status(505).json({ message: "Error del servidor", error });
    console.log(error);
  }
} */
module.exports = payCtrl;
