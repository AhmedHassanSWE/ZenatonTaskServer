const axios = require("axios");

module.exports = async (oldLink) => {
  const response = await axios.post(
    "https://api.pics.ee/v1/links/?access_token=20f07f91f3303b2f66ab6f61698d977d69b83d64",
    {
      url: oldLink,
      externalId: "customer_test_1",
    }
  );

  const link = response.data.data.picseeUrl;

  console.log("LINK IS", link);

  return link;
};
