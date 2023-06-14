import { Events, TextChannel } from 'discord.js';

import { Client } from '../core/Client';
import { Event } from '../core/Event';
import { EventNotifier } from '../lib/notifications/EventNotifier';
import { Worker } from '../lib/Worker';
import { Broadcaster } from '../lib/notifications/Broadcaster';
import { isDev } from '../utils/Commons';

export default class Ready extends Event {
  constructor(client: Client) {
    super(client, 'onReady', Events.ClientReady);
  }

  async run(): Promise<void> {

    if (this.client.cluster.id === 0) {
      new EventNotifier(this.client);
      if (!isDev) new Worker(this.client);
    }

    const shards =
      [...this.client.cluster.ids.keys()].length > 1
        ? [...this.client.cluster.ids.keys()].join(', ')
        : [...this.client.cluster.ids.keys()];

    this.client.logger.info(
      `${this.client.user?.tag}, ready to serve ${this.client.guilds.cache.size} servers on cluster #${this.client.cluster.id} (Shards: ${shards})`,
    );
  }
}
