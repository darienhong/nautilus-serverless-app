import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as NautilusServerless from '../lib/nautilus-serverless-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new NautilusServerless.NautilusServerlessStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
