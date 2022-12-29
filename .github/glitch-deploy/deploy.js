const upload_Md = require('./git-push.js');
const createNew_Md = require('./newCreate.js')
const shell = require('shelljs')
const queryString = require('query-string');
const axios = require("axios").default;
const axiosRetry = require('axios-retry');

setTimeout(() => {
  console.log('force exit');
  process.exit(0)
}, 30 * 60 * 1000);

axiosRetry(axios, {
  retries: 100,
  retryDelay: (retryCount) => {
    // console.log(`retry attempt: ${retryCount}`);
    return 3000 || retryCount * 1000;
  },
  retryCondition: (error) => {
    return error.response.status === 502;
  },
});


const listProject = `https://773d6783-2ba4-4f16-a1cb-b932c880b1a2@api.glitch.com/git/moored-chambray-almandine|https://773d6783-2ba4-4f16-a1cb-b932c880b1a2@api.glitch.com/git/great-mud-owner|https://773d6783-2ba4-4f16-a1cb-b932c880b1a2@api.glitch.com/git/glowing-pushy-albatross|https://773d6783-2ba4-4f16-a1cb-b932c880b1a2@api.glitch.com/git/intermediate-equinox-durian|https://773d6783-2ba4-4f16-a1cb-b932c880b1a2@api.glitch.com/git/pie-goofy-cacao|https://773d6783-2ba4-4f16-a1cb-b932c880b1a2@api.glitch.com/git/mature-fringe-slug|https://773d6783-2ba4-4f16-a1cb-b932c880b1a2@api.glitch.com/git/leaf-organic-volleyball|https://773d6783-2ba4-4f16-a1cb-b932c880b1a2@api.glitch.com/git/fog-marvelous-quart|https://773d6783-2ba4-4f16-a1cb-b932c880b1a2@api.glitch.com/git/harmonious-simple-trick|https://773d6783-2ba4-4f16-a1cb-b932c880b1a2@api.glitch.com/git/leather-striped-kiss|https://773d6783-2ba4-4f16-a1cb-b932c880b1a2@api.glitch.com/git/shadowed-cuboid-cardigan|https://773d6783-2ba4-4f16-a1cb-b932c880b1a2@api.glitch.com/git/apple-intriguing-oxygen|https://773d6783-2ba4-4f16-a1cb-b932c880b1a2@api.glitch.com/git/fog-glitter-hippodraco|https://773d6783-2ba4-4f16-a1cb-b932c880b1a2@api.glitch.com/git/dusty-mirage-gasosaurus`.trim().split('|');

const delay = t => {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve(true);
    }, t);
  });
};

(async () => {
  try {
    let accountNumber = 0;

    for (let i = 0; i < listProject.length; i++) {
      accountNumber = i + 1;
      try {
        const nameProject = listProject[i].split('/')[4]
        console.log('deploy', nameProject);
        createNew_Md.run(nameProject)
        await upload_Md.upload2Git(listProject[i].trim(), 'code4Delpoy');
        console.log(`account ${accountNumber} upload success ^_^`);

        axios
          .get(`https://eager-profuse-python.glitch.me/deploy?${queryString.stringify({
            email: listProject[i].trim() + ' true'
          })}`)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response.data);
            } else {
              console.log('Loi');
            }
          });

        if (i + 1 < listProject.length) await delay(1.8 * 60 * 1000);
      } catch (error) {
        console.log(`account ${accountNumber} upload fail ^_^`);
        axios
          .get(`https://eager-profuse-python.glitch.me/deploy?${queryString.stringify({
            email: listProject[i].trim() + ' false'
          })}`)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response.data);
            } else {
              console.log('Loi');
            }
          });
      }

      if (process.cwd().includes('code4Delpoy')) shell.cd('../', { silent: true });

    }

    await delay(20000)
    console.log('Done! exit')
    process.exit(0)

  } catch (err) {
    console.log(`error: ${err}`);
  }
})();