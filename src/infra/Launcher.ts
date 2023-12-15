import { App } from "aws-cdk-lib";
import { PrizmLambdaStack } from "./stacks/LambdaStack";
import { ApiStack } from "./stacks/ApiStack";

const app = new App()
const lambdaStack = new PrizmLambdaStack(app, "PrizmLambdaStack")
new ApiStack(app, "ApiStack", {
  prizmLambdaIntegration: lambdaStack.prizmLambdaIntegration,
})