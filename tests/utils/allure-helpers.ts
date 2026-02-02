import { test } from '@playwright/test';

export enum Severity {
  BLOCKER = 'blocker',
  CRITICAL = 'critical',
  NORMAL = 'normal',
  MINOR = 'minor',
  TRIVIAL = 'trivial',
}

export enum Layer {
  API = 'API Layer',
  BUSINESS = 'Business Logic',
  INTEGRATION = 'Integration',
  UNIT = 'Unit',
}

export class AllureHelper {
  
  static severity(severity: Severity) {
    return test.info().annotations.push({
      type: 'severity',
      description: severity,
    });
  }

  static feature(feature: string) {
    return test.info().annotations.push({
      type: 'feature',
      description: feature,
    });
  }

  static story(story: string) {
    return test.info().annotations.push({
      type: 'story',
      description: story,
    });
  }

  static owner(owner: string) {
    return test.info().annotations.push({
      type: 'owner',
      description: owner,
    });
  }

  static tag(tag: string) {
    return test.info().annotations.push({
      type: 'tag',
      description: tag,
    });
  }

  static issue(issueId: string, url?: string) {
    return test.info().annotations.push({
      type: 'issue',
      description: url || `Issue: ${issueId}`,
    });
  }

  static link(url: string, name?: string) {
    return test.info().annotations.push({
      type: 'link',
      description: `${name || 'Link'}: ${url}`,
    });
  }

  static async step<T>(name: string, body: () => Promise<T>): Promise<T> {
    return await test.step(name, body);
  }


  static attach(name: string, content: string, type: string = 'text/plain') {
    return test.info().attach(name, { body: content, contentType: type });
  }

  
  static attachJSON(name: string, data: any) {
    return test.info().attach(name, {
      body: JSON.stringify(data, null, 2),
      contentType: 'application/json',
    });
  }
}