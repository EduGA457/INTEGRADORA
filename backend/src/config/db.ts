 import mongoose from 'mongoose'

 const connectDBMongo =  async():Promise<void>=>{
    const mongoUrl="mongodb://localhost:27017/INTEGRADORA" // url para local 
    //const mongoUrl="mongobd://admin:admin@l:27017/proyecto"
    if (!mongoUrl){
        throw new Error('MONGO_URL no esta definida en .env')
    }

    try{
        await mongoose.connect(mongoUrl)
        console.log('Conectado a MongoDB')
    }catch(error){
        console.log("Error al conectar con mongo: ",error)
    }
 }

 export default connectDBMongo