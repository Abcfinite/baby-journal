import _ from 'lodash'
import { parse } from 'node-html-parser';

export default class PlayerListParser {
  static parse(html: string): string {
    const root = parse(html);
    const links = root.querySelectorAll("a")

    if (links.length > 1) {
      console.log('too many result check name')
    } else if (links.length == 1) {
      return links[0].getAttribute('href')
    }

    return null
  }
}