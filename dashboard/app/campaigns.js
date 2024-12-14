/* ------------------------------------------------------------------------------------------------- */
/* ------------------------------------------- CAMPAIGNS ------------------------------------------- */
/* ------------------------------------------------------------------------------------------------- */

// Variable global para almacenar la lista original de clientes
let originalClients = []

// Función para enviar emails usando EmailJS
async function sendCampaignEmail(clients, title, content, imageUrl) {
    try {
        for (const client of clients) {
            if (!client.email) {
                console.error(`Missing email for client: ${client.name}`)
                continue
            }

            const templateParams = {
                to_email: client.email,
                name: client.name,
                title: title,
                content: content,
                image_url: imageUrl || ''
            }

            const serviceID = 'service_llm5u9s'
            const templateID = 'template_cz31rhh'

            await emailjs.send(serviceID, templateID, templateParams)
        }
        alert('Campaña enviada con éxito!')
    } catch (error) {
        console.error('Error sending campaign emails:', error)
        alert('Error al enviar la campaña.')
    }
}

// Función para subir imágenes a Cloudinary
async function uploadImageToCloudinary(imageFile) {
    const formData = new FormData()
    formData.append('file', imageFile)
    formData.append('upload_preset', 'my_unsigned_preset')

    try {
        const response = await fetch('https://api.cloudinary.com/v1_1/dc4g5ehpo/image/upload', {
            method: 'POST',
            body: formData
        })
        const data = await response.json()

        if (response.ok) {
            return data.secure_url
        } else {
            throw new Error(data.error.message)
        }
    } catch (error) {
        console.error('Error uploading the image:', error)
        alert('Error al cargar el archivo.')
    }
}

// Función para actualizar el tamaño de la audiencia
function displayAudienceSize(clients) {
    const audienceSize = clients.length
    const audienceElement = document.getElementById('audience-size')
    if (audienceElement) {
        audienceElement.textContent = `Tamaño de la audiencia: ${audienceSize}`
    }
}

// Función para filtrar clientes
function filterClients(clients, variable, condition, value) {
    return clients.filter(client => {
        const clientValue = client[variable]?.toString().toLowerCase() || ''
        const filterValue = value.toLowerCase()

        if (condition === 'contains') {
            return clientValue.includes(filterValue)
        } else if (condition === 'not-contains') {
            return !clientValue.includes(filterValue)
        }
        return false
    })
}

// Carga inicial de clientes y configuración de eventos
document.addEventListener('DOMContentLoaded', async function () {
    // Obtener la lista de clientes original
    originalClients = await getAll('clients')
    let filteredClients = [...originalClients]

    // Mostrar tamaño de la audiencia inicial
    displayAudienceSize(originalClients)

    // Elementos del DOM
    const fileInput = document.getElementById('image-upload')
    const fileName = document.getElementById('file-name')

    // Mostrar nombre del archivo al subir una imagen
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0]
        fileName.textContent = file ? file.name : 'Subir Archivo'
    })

    // Botón "Aplicar" para filtrar clientes
    document.getElementById('apply-btn').addEventListener('click', (e) => {
        e.preventDefault()

        const variable = document.getElementById('filter-variable').value
        const condition = document.getElementById('filter-condition').value
        const value = document.getElementById('filter-value').value.trim()

        if (!variable || !value) {
            alert('Por favor ingrese valores válidos para filtrar.')
            return
        }

        filteredClients = filterClients(originalClients, variable, condition, value)
        displayAudienceSize(filteredClients)
    })

    // Botón "Reset" para limpiar filtros
    document.getElementById('reset-btn').addEventListener('click', (e) => {
        e.preventDefault()

        filteredClients = [...originalClients]
        document.getElementById('filter-variable').selectedIndex = 0
        document.getElementById('filter-condition').selectedIndex = 0
        document.getElementById('filter-value').value = ''
        displayAudienceSize(originalClients)
    })

    // Botón "Enviar Campaña"
    document.getElementById('campaign-btn').addEventListener('click', async (e) => {
        e.preventDefault()

        const loader = document.getElementById('loader')
        loader.style.display = "block"

        const title = document.getElementById('title').value
        const content = document.getElementById('content').value
        const imageFile = document.getElementById('image-upload').files[0]

        if (!title || !content) {
            alert('Por favor complete el título y el contenido.')
            loader.style.display = "none"
            return
        }

        let imageUrl = ''
        if (imageFile) {
            imageUrl = await uploadImageToCloudinary(imageFile)
        }

        try {
            await sendCampaignEmail(filteredClients, title, content, imageUrl)
        } catch (error) {
            console.error('Error sending campaign emails:', error)
        }

        loader.style.display = "none"
    })
})
