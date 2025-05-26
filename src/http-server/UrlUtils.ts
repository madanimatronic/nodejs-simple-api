import { ExtendedIncomingMessage } from '@/http-server/types';

export class UrlUtils {
  static findPathTemplate(pathname: string, routes: string[]) {
    const matchingSplittedTemplate = this.findPathSplittedTemplate(
      pathname,
      routes,
    );

    if (matchingSplittedTemplate) {
      return this.makePath(matchingSplittedTemplate);
    }
  }

  static findPathParams(pathname: string, routes: string[]) {
    const splittedPathname = this.splitURL(pathname);
    const matchingSplittedTemplate = this.findPathSplittedTemplate(
      pathname,
      routes,
    );

    if (matchingSplittedTemplate) {
      return this.makePropsObject(splittedPathname, matchingSplittedTemplate);
    }
  }

  private static findPathSplittedTemplate(pathname: string, routes: string[]) {
    const splittedPathname = this.splitURL(pathname);
    const splittedTemplates = this.splitMultipleURLs(this.getTemplates(routes));

    const equalLengthSplittedTemplates = splittedTemplates.filter(
      (splittedTemplate) => splittedTemplate.length === splittedPathname.length,
    );
    return this.findMatchingSplittedTemplate(
      splittedPathname,
      equalLengthSplittedTemplates,
    );
  }

  private static makePropsObject(
    splittedPathname: string[],
    splittedTemplate: string[],
  ) {
    return splittedTemplate.reduce(
      (props, part, index) => {
        if (part.startsWith(':')) {
          const propKey = part.substring(1);
          props[propKey] = splittedPathname[index];
        }
        return props;
      },
      {} as ExtendedIncomingMessage['params'],
    );
  }

  private static findMatchingSplittedTemplate(
    splittedPath: string[],
    splittedTemplates: string[][],
  ) {
    return splittedTemplates.find((spTemplate) =>
      spTemplate.every(
        (part, index) => part === splittedPath[index] || part.startsWith(':'),
      ),
    );
  }

  private static splitURL(url: string) {
    const formattedString = url[0] === '/' ? url.substring(1) : url;
    return formattedString.split('/');
  }

  private static splitMultipleURLs(urls: string[]) {
    return urls.map((url) => this.splitURL(url));
  }

  private static makePath(parts: string[]) {
    return parts.reduce((result, part) => result.concat(`/${part}`), '');
  }

  private static getTemplates(routes: string[]) {
    return routes.filter((route) => route.includes('/:'));
  }
}
