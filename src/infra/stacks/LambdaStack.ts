import { Duration, Stack, StackProps } from 'aws-cdk-lib'
import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway'
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam'
import { Runtime } from 'aws-cdk-lib/aws-lambda'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { IBucket } from 'aws-cdk-lib/aws-s3'
import { Construct } from 'constructs'
import { join } from 'path'

interface PrizmLambdaStackProps extends StackProps {
  prizmBucket: IBucket
}

export class PrizmLambdaStack extends Stack {
  public readonly prizmLambdaIntegration: LambdaIntegration
  

  constructor(scope: Construct, id: string, props: PrizmLambdaStackProps) {
    super(scope, id, props)

    const prizmLambda = new NodejsFunction(this, 'PrizmLambdaStack', {
      runtime: Runtime.NODEJS_18_X,
      handler: 'handler',
      entry: join(__dirname, '..', '..', 'services', 'prizm', 'handler.ts'),
      environment: {
        BUCKET_NAME: props.prizmBucket.bucketName,
        PRIZM_URL: process.env.PRIZM_URL!,
      },
      timeout: Duration.seconds(30),
      memorySize: 256,
    })

    prizmLambda.addToRolePolicy(new PolicyStatement({
      effect: Effect.ALLOW,
      actions: [
        "s3:*"
      ],
      resources: [props.prizmBucket.bucketArn, `${props.prizmBucket.bucketArn}/*`],
    }))

    this.prizmLambdaIntegration = new LambdaIntegration(prizmLambda)
  }
}