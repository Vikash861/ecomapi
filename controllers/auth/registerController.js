import Joi from 'joi';
import {User} from '../../models';
import bcrypt from 'bcrypt';
import JwtServices from '../../services/JwtServices'


const registerController = {

    async register(req,res,next){
        
        // validating password
        const registerSchema = Joi.object({
            name: Joi.string().min(3).max(30).required(),
            email : Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
            repeat_password : Joi.ref('password') 
        })
        const {error} = registerSchema.validate(req.body);
        if(error){
            return next(error);
        }


        // checking if email is already exist
        try{
            const exist = await User.exists({emial : req.body.email})
            if(exist){
                return next(CustomErrorHandler.alreadyExist('This email is already in use')); 
            }
        }
        catch(err){
            return next(err)
        }


        const hashedPassword = await bcrypt.hash('req.body.password',10);

        // preparing the document to store in the database
        const {name,email} = req.body;
        const user = new User({
            name,
            email,
            password:hashedPassword
        })

        
        let access_token;
        try {
            const result = await user.save(req, res);
            access_token = JwtServices.sign({_id:result._id, role:result.role});

        } catch (err) {
            return next(err)
        }


        res.json({"access-token": access_token});
    }
}

export default registerController;