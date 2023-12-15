import { Stack, StackProps } from 'aws-cdk-lib'
import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway'
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam'
import { Runtime } from 'aws-cdk-lib/aws-lambda'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { Construct } from 'constructs'
import { join } from 'path'

interface PrizmLambdaStackProps extends StackProps {}

export class PrizmLambdaStack extends Stack {
  public readonly prizmLambdaIntegration: LambdaIntegration

  constructor(scope: Construct, id: string, props?: PrizmLambdaStackProps) {
    super(scope, id, props)

    const prizmLambda = new NodejsFunction(this, 'PrizmLambdaStack', {
      runtime: Runtime.NODEJS_18_X,
      handler: 'handler',
      entry: join(__dirname, '..', '..', 'services', 'prizm', 'handler.ts'),
    })

    prizmLambda.addToRolePolicy(new PolicyStatement({
      effect: Effect.ALLOW,
      actions: [
        's3:ListAllMyBuckets',
        's3:GetBucketLocation'
      ],
      resources: ['*'],
    }))

    this.prizmLambdaIntegration = new LambdaIntegration(prizmLambda)
  }
}