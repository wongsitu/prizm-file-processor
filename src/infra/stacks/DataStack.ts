import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib'
import { Construct } from 'constructs';
import { getSuffixFromStack } from '../Utils';
import { Bucket, HttpMethods, IBucket } from 'aws-cdk-lib/aws-s3';

export class PrizmDataStack extends Stack {
  public readonly prizmFiles: IBucket;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const suffix = getSuffixFromStack(this);
    this.prizmFiles = new Bucket(this, 'PrizmFiles', {
      bucketName: `prizm-files-${suffix}`,
      cors: [{
        allowedMethods: [
            HttpMethods.HEAD,
            HttpMethods.GET,
            HttpMethods.PUT
        ],
        allowedOrigins: ['*'],
        allowedHeaders: ['*']
      }]
    });
    new CfnOutput(this, 'PrizmFilesBucketName', {
        value: this.prizmFiles.bucketName
    });
  }
}