const URL = "https://www.suarmi.com/api/v1/"

async function checkSuarmiUserExist(phoneNumber) {

  const url = URL + 'user?email=' + phoneNumber;
  // const url = 'https://www.suarmi.com/api/v1/quote?from_currency=MXN&to_currency=USDC&from_amount=500&network=MATIC';
  console.log('url', url);

  const apiResponse = await fetch(url, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      'Authorization': 'Basic dGVzdGluZ0BzdWFybWkuY29tOnRlc3RpbmdFTUFJTA==',
    },
  });
  console.log(apiResponse);
  const response = await apiResponse.json();
  console.log(response);
}


const main = async () => {
  // await checkSuarmiUserExist('66%2450%4242');
  // await checkSuarmiUserExist('COCD891111HSRTRG04');
  await checkSuarmiUserExist('dpedrocota@gmail.com');
}

main();