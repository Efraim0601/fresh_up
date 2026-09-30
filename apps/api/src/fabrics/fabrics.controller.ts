import { Controller, Get } from "@nestjs/common";
import { Fabric } from "@prisma/client";
import { FabricsService } from "./fabrics.service";

// GET /fabrics - liste des tissus du catalogue, sans auth en Phase 1 (voir
// docs/PHASE1_TASKS.md - "Endpoint minimal GET /fabrics").
@Controller("fabrics")
export class FabricsController {
  constructor(private readonly fabricsService: FabricsService) {}

  @Get()
  findAll(): Promise<Fabric[]> {
    return this.fabricsService.findAll();
  }
}
