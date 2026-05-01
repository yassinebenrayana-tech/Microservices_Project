import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  @EventPattern('order.created')
  handleOrderCreated(@Payload() message: any) {
    this.logger.log(`Received order event: ${JSON.stringify(message)}`);
    const orderId = message.id;
    const email = message.customerEmail;
    
    // Attendu minimal : un consumer NestJS qui affiche une sortie du type « confirmation envoyée à client@test.com pour la commande 15 »
    console.log(`[${new Date().toISOString()}] confirmation envoyée à ${email} pour la commande ${orderId}`);
  }
}
