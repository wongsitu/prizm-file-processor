import { Stack, StackProps } from 'aws-cdk-lib'
import { Cors, LambdaIntegration, ResourceOptions, RestApi } from 'aws-cdk-lib/aws-apigateway'
import { Construct } from 'constructs'

interface ApiStackProps extends StackProps {
  prizmLambdaIntegration: LambdaIntegration
}

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props)

    const api = new RestApi(this, 'PrizmApi')

    const optionsWithCORS: ResourceOptions = {
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
      },
    }

    const prizmResource = api.root.addResource('files', optionsWithCORS);
    prizmResource.addMethod('GET', props.prizmLambdaIntegration);
    prizmResource.addMethod('POST', props.prizmLambdaIntegration)
  }
}