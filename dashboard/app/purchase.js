/* ------------------------------------------------------------------------------------------------- */
/* ---------------------------------------- UPLOAD PURCHASE ---------------------------------------- */
/* ------------------------------------------------------------------------------------------------- */

// Display Function
const functionHeader = document.getElementById('function-header')
const functionSelector = document.getElementById('function-selector')
const addInputs = document.getElementById('add-points-inputs')
const claimInputs = document.getElementById('claim-gift-inputs')

function toggleInputs() {
    const selectedFunction = functionSelector.value
    console.log(selectedFunction)
    
    if (selectedFunction === 'add-points') {
        functionHeader.innerHTML = 'Sumar Pandita'
        addInputs.style.display = 'flex'
        claimInputs.style.display = 'none'
    } else if (selectedFunction === 'claim-gift') {
        functionHeader.innerHTML = 'Reclamar Regalo'
        addInputs.style.display = 'none'
        claimInputs.style.display = 'flex'
    }
}

functionSelector.addEventListener('change', toggleInputs)
toggleInputs()

function checkSelector () {
    return functionSelector.value
}


// Validate Inputs 
function validatePhoneNumber (phoneNumber) {

    let phoneInput
    if (document.getElementById('phone-add')) {
        phoneInput = document.getElementById('phone-add')
    } else if (document.getElementById('phone-gift')) {
        phoneInput = document.getElementById('phone-add')
    } else {
        phoneInput = document.getElementById('phoneNumber')
    }
   
    const phonePattern = /^0\d{8}$/ // starts with 0 and is 8 digits
    if (!phonePattern.test(phoneNumber)) {
        phoneInput.style.borderColor = 'red'
        alert('El celular debe comenzar con 0 y tener 8 dígitos')
        valid = false
    } else {
        phoneInput.style.borderColor = ''
    }
  
}

// Upload Purchase
async function uploadPurchase (phoneNumber, amountSpentNow) {

    validatePhoneNumber(phoneNumber)
    const amountSpentNowNum = parseFloat(amountSpentNow)
    if (isNaN(amountSpentNowNum)) {
        alert('Importe invalido:', amountSpentNow)
        return
    }

    const client = await getClientByPhoneNumber(phoneNumber)

    if (client && client.currentPoints < 8) {  

        const totalExpenditure = client.totalSpent + amountSpentNowNum

        const nowPoints = Math.floor(amountSpentNow / 350)

        let currentPoints
        let totalPoints

        let averageExpenditure
        const totalPurchases = client.purchaseCount + 1
        averageExpenditure = totalExpenditure / totalPurchases

        const updates = {}

        if (currentPoints == 8) {

            updates.giftAvailable = true
            sendFileEmail(client, 'gift')
            currentPoints = client.currentPoints + nowPoints
            totalPoints = client.totalPoints + nowPoints

        } else if (currentPoints > 8) {

            updates.giftAvailable = true
            sendFileEmail(client, 'gift')
            currentPoints = 8
            totalPoints = client.totalPoints + 8

        } else if (currentPoints <= 8) {

            currentPoints = client.currentPoints + nowPoints
            totalPoints = client.totalPoints + nowPoints
            
        }

        alert(`El cliente sumo panditas: ${currentPoints}/8`)

        updates.currentPoints = currentPoints
        updates.totalPoints = totalPoints
        updates.purchaseCount = totalPurchases
        updates.totalSpent = totalExpenditure
        updates.averageExpenditure = averageExpenditure.toFixed(2)

        await updateClient(phoneNumber, updates)
        console.log('Se ha cargado la compra con exito!')

    } else if (client && client.currentPoints == 8) {
        alert(`${client.currentPoints}/8: El cliente debe reclamar su regalo`)
    } else {
        alert('No se ha encontrado el cliente.')
    }

}

// Claim Gift
async function claimGift (phoneNumber) {

    phoneNumber = phoneNumber.trim()

    const client = await getClientByPhoneNumber(phoneNumber)

    if (client) {

        const updates = {}

        if (client.currentPoints == 8 && client.giftAvailable == true) {

            updates.currentPoints = client.currentPoints - 8
            updates.giftAvailable = false
            updates.giftsClaimed = client.giftsClaimed + 1
            alert(`${client.currentPoints}/8: El cliente reclamo su regalo`)

        } else {
            alert(`El cliente no tiene ningun regalo: ${client.currentPoints}/8`)
        }

        await updateClient(phoneNumber, updates)

    } else {
        alert('No se ha encontrado el cliente.')
    }

}
