const { google } = require('googleapis')
const path = require('path')

const getLeads = async (sheetId) => {
    try {
        // 1. Set up auth — point to your credentials file
        const auth = new google.auth.GoogleAuth({
            keyFile: path.join(__dirname, '../../google-credentials.json'),
            scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
        })

        // 2. Create a sheets client using that auth
        const sheets = google.sheets({ version: 'v4', auth })

        // 3. Fetch the data
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range: 'Sheet1!A1:D100'    // read columns A-D, rows 1-100
        })

        // 4. response.data.values is an array of arrays:
        //    [ ['Name','Email','Company','Status'], ['harsh','harsh@gmail.com',...] ]
        const rows = response.data.values
        if (!rows || rows.length === 0) return []

        // 5. First row = headers. Rest = data.
        //    Convert each data row into an object using headers as keys.
        const headers = rows[0]
        const leads = rows.slice(1).map(row => {
            const lead = {}
            headers.forEach((header, index) => {
                lead[header] = row[index]
            })
            return lead
        })

        return leads
    } catch (error) {
        throw new Error(`Sheets fetch failed: ${error.message}`)
    }
}

module.exports = { getLeads }