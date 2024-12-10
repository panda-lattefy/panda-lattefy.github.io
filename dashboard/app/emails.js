// Function to send emails using EmailJS

const images = {
   gift: 'https://res.cloudinary.com/dc4g5ehpo/image/upload/v1732316741/gift_vh4axy.png'
}

const titles = {
    gift: '¡Reclama tu burger/milanesa 100% gratis!'
}

let imageUrl
let title

async function sendFileEmail(client, why) {

    if (why == 'gift') {
        imageUrl = images.gift
        title = titles.gift
    }

    try {
    
        const templateParams = {
            to_email: client.email,
            name: client.name,
            title: title,
            image_url: imageUrl || ''
        }

        const serviceID = 'service_llm5u9s';
        const templateID = 'template_cp5w5vg';

        await emailjs.send(serviceID, templateID, templateParams)
    
    } 
    catch (error) {
        console.error('Error sending email:', error)
    }
    
}
