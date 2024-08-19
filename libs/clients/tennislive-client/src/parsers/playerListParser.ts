import _ from 'lodash'
import { parse } from 'node-html-parser';

export default class PlayerListParser {
  static parse(html: string, playerName: string): string {
    const root = parse(html);
    const links = root.querySelectorAll("a")

    if (links.length > 1) {
      const link = links.find(l => l.getAttribute('title').toLowerCase() === playerName.toLowerCase())
      return link.getAttribute('href')
    } else if (links.length == 1) {
      return links[0].getAttribute('href')
    }

    return null
  }
}