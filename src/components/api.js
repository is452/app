import axios from 'axios'

const server_url = 'https://api.is452.cloud/'


export const getAllTransactions = () => {
    return axios
        .get(server_url + 'get_user_transactions?user_wallet_address=0x123sdasdas')
        .then(response => {
            return response.data
        })
        .catch(err => {
            console.log(err)
        })
}

export const getAllInsurance = () => {
    return axios
        .get(server_url + 'get_insurance_by_user?user_wallet_address=' + '0x1u23jsd89askn')
        .then(response => {
            return response.data
        })
        .catch(err => {
            console.log(err)
        })
}

export const getAllFlightInsurances = () => {
    return axios
        .get(server_url + 'get_all_insurances?insurance_type=flight_delay&status=open')
        .then(response => {
            return response.data
        })
        .catch(err => {
            console.log(err)
        })
}

export const getInsuranceByID = id => {
    return axios
        .get(server_url + 'get_insurance_by_id?insurance_id=' + id)
        .then(response => {
            return response.data
        })
        .catch(err => {
            console.log(err)
        })
}



