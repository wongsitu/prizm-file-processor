import { App } from "aws-cdk-lib";
import { PrizmLambdaStack } from "./stacks/LambdaStack";
import { ApiStack } from "./stacks/ApiStack";
import { PrizmDataStack } from "./stacks/DataStack";

const app = new App()
const prizmDataStack = new PrizmDataStack(app, "PrizmDataStack")
const lambdaStack = new PrizmLambdaStack(app, "PrizmLambdaStack", {
  prizmBucket: prizmDataStack.prizmFiles,
})
new ApiStack(app, "ApiStack", {
  prizmLambdaIntegration: lambdaStack.prizmLambdaIntegration,
})