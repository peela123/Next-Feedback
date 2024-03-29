// async function query(data: any) {
//   const response = await fetch(
//     "https://pejn1kp53jrm4kgm.us-east-1.aws.endpoints.huggingface.cloud",
//     {
//       headers: {
//         Accept: "application/json",
//         Authorization: "Bearer hf_XXXXX",
//         "Content-Type": "application/json",
//       },
//       method: "POST",
//       body: JSON.stringify(data),
//     }
//   );
//   const result = await response.json();
//   return result;
// }

// query({
//   inputs: "good teaching technique",
//   parameters: {},
// }).then((response) => {
//   const res = JSON.stringify(response);
//   console.log(res);
//   console.log(res.data);
// });
