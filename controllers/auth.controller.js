const { verifyUserService } = require("../services/auth.service");

exports.verifyUser = async (req, res, next) => {
    try {
        const data = await verifyUserService(req.body);
        res.status(200).json({ success: true });
    } catch (err) {
        next(err);
    }
}