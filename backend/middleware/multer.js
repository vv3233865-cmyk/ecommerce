const multer = require('multer')
const {v4 : uuidv4, v4} = require('uuid')


const storage = multer.diskStorage( {
    destination(req,file,cb){
        cb(null,'./uploads')
    },
    filename(req,file,cb){
        const id = uuidv4()
        const extention = file.originalname.split('.').pop();
        const filename = `${id}.${extention}`
        cb(null,filename)
    }

})


const uploadfile = multer({storage}).single("image")

module.exports  = uploadfile