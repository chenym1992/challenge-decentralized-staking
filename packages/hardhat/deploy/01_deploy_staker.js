// deploy/01_deploy_staker.js


module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    const exampleExternalContract = await deployments.get("ExampleExternalContract");

    await deploy("Staker", {
        // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
        from: deployer,
        args: [exampleExternalContract.address],
        log: true,
    });
};
module.exports.tags = ["Staker"];