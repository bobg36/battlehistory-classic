document.addEventListener('DOMContentLoaded', function() {
    // Listener for the Fetch Battles button
    document.getElementById('fetchButton').addEventListener('click', function() {
        const requesterAddress = document.getElementById('addressInput').value.trim();
        if (!requesterAddress) {
            alert('Please enter an address.');
            return;
        }

        fetchBattleHistory(requesterAddress); // Call the function with the user-entered address
    });
});

function fetchBattleHistory(requesterAddress) {
    fetch(`https://api-gateway.skymavis.com/classic/v1/community/users/${requesterAddress}/battle-histories?limit=100&offset=10`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'vjpF0EKi39qzdfpPoqggdmNR5cvP01dN'
        }
    })
    .then(response => response.json())
    .then(data => {
        // Clearing tables before inserting new data
        document.getElementById('arenaTable').innerHTML = '';
        document.getElementById('tournamentTable').innerHTML = '';
        document.getElementById('colosseumTable').innerHTML = '';

        // Your existing logic for inserting data into tables
        data.items.forEach(item => {
            const tableBody = document.querySelector(`#${item.pvpType.toLowerCase()}Table`);
            const row = tableBody.insertRow();

            if (item.winner.toLowerCase() === requesterAddress.toLowerCase()) {
                row.style.backgroundColor = 'lightgreen';
            } else {
                row.style.backgroundColor = 'lightcoral';
            }

            row.insertCell().textContent = new Date(item.createdAt).toLocaleString();

            const replayLinkCell = row.insertCell();
            const replayLink = document.createElement('a');
            replayLink.href = `https://cdn.axieinfinity.com/game/deeplink.html?f=rpl&q=${item.uuid}`;
            replayLink.target = "_blank";
            replayLink.textContent = 'View Replay';
            replayLinkCell.appendChild(replayLink);

            row.insertCell().innerHTML = formatTeamSimple(item.team[0]);
            row.insertCell().innerHTML = item.team.length > 1 ? formatTeamSimple(item.team[1]) : 'N/A';
        });
    })
    .catch(error => console.error('Error:', error));
}

function formatTeamSimple(team) {
    if (!team) return 'N/A';
    const ownerLink = `<a href="https://app.axieinfinity.com/profile/${team.owner}/axies/" target="_blank">All Axies</a>`;
    const axieLinks = team.fighterIDs.map(id => 
        `<a href="https://app.axieinfinity.com/marketplace/axies/${id}/" target="_blank">${id}</a>`
    ).join(', ');
    const axieImages = team.fighterIDs.map(id =>
        `<img src="https://assets.axieinfinity.com/axies/${id}/axie/axie-full-transparent.png" alt="Axie ${id}" style="width:60px;height:60px; object-fit: cover; margin-left: 5px;">`
    ).join('');

    return `<div style="display: flex; justify-content: space-between; align-items: center;">
                <div>${ownerLink}<br>${axieLinks}</div>
                <div>${axieImages}</div>
            </div>`;
}
