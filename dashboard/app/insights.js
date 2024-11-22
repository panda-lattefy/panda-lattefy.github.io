/* --------------------------------------------------------------------------------------------------*/
/* -------------------------------------- DASHBOARD INSIGHTS --------------------------------------- */
/* --------------------------------------------------------------------------------------------------*/

// Display the amount of clients
function displayClientCount(clients) {
    const clientAmount = document.getElementById('client-amount')
    clientAmount.textContent = clients.length 
}

// Display total billies
function displayTotalPoints(clients) {
    const allTotalPoints = clients.map(client => client.totalPoints)

    let totalPointsSum = 0
    for (let i = 0; i < allTotalPoints.length; i++) {
        totalPointsSum += allTotalPoints[i]
    }

    const totalPointsOutput = document.getElementById('total-points')
    totalPointsOutput.textContent = totalPointsSum
}

// Display claimed cards
function displayClaimedCards(clients) {
    const allClaimedGifts = clients.map(client => client.claimedGifts)

    let claimedCardsSum = 0
    for (let i = 0; i < allClaimedGifts.length; i++) {
        claimedCardsSum += allClaimedGifts[i]
    }

    const claimedCardsOutput = document.getElementById('claimed-cards')
    claimedCardsOutput.textContent = claimedCardsSum
}

// Calculate Overall Average Rating
function sentimentAnalysis(clients) {
    const allRatings = clients.map(client => client.averageRating)

    let ratingSum = 0
    for (let i = 0; i < allRatings.length; i++) {
        ratingSum += allRatings[i]
    }

    let ratingsNotZero = 0
    for (let i = 0; i < allRatings.length; i++) {
        if (allRatings[i] != 0) {
            ratingsNotZero += 1
        }
    }

    const overallRating = ratingSum / ratingsNotZero
    
    const sentimentOutput = document.getElementById('sentiment-analysis')
    sentimentOutput.textContent = overallRating.toFixed(2)
}

// Calculate Overall Average Expenditure
function displayAverageExpenditure(clients) {

    const allTotalsSpent = clients.map(client => client.totalSpent)

    let totalSum = 0
    for (let i = 0; i < allTotalsSpent.length; i++) {
        totalSum += allTotalsSpent[i]
    }

    const allTotalPoints = clients.map(client => client.totalPoints)

    let totalPointsSum = 0
    for (let i = 0; i < allTotalPoints.length; i++) {
        totalPointsSum += allTotalPoints[i]
    }

    const averageSpentOutput = document.getElementById('average-expenditure')

    if (totalPointsSum > 0) {
        const overallExpenditure = totalSum / totalPointsSum
        averageSpentOutput.textContent = "$ " + overallExpenditure.toFixed(2)
    } else {
        averageSpentOutput.textContent = "$ 0"
    }
    
}

// Display Total Profit
function displayTotalProfit(clients) {
    const allTotals = clients.map(client => client.totalSpent)

    let totalSum = 0
    for (let i = 0; i < allTotals.length; i++) {
        totalSum += allTotals[i]
    }
    
    const totalOutput = document.getElementById('total-profit')
    totalOutput.textContent = "$" + totalSum.toFixed(2)
}

// Average Log Count
function displayLogCount (clients) {
    const allLogCounts = clients.map(client => client.logCount)

    let totalLogs = 0
    for (let i = 0; i < allLogCounts.length; i++) {
        totalLogs += allLogCounts[i]
    }

    const logsOutput = document.getElementById('log-count')
    const averageLogs = (totalLogs / allLogCounts.length).toFixed(0)
    logsOutput.textContent = averageLogs
}