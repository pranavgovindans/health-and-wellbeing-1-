const nodemailer=require('nodemailer');
module.exports=async(req,res)=>{
  if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
  const{title,copy}=req.body||{};
  if(!title||!copy)return res.status(400).json({error:'Title and news copy are required'});
  try{
    const mailer=nodemailer.createTransport({service:'gmail',auth:{user:process.env.GMAIL_USER,pass:process.env.GMAIL_APP_PASSWORD}});
    await mailer.sendMail({from:process.env.GMAIL_USER,to:process.env.GMAIL_USER,subject:`VitaWell news: ${title}`,text:`${title}\n\n${copy}`});
    res.status(200).json({ok:true});
  }catch(_){res.status(500).json({error:'Email could not be sent'});}
};
