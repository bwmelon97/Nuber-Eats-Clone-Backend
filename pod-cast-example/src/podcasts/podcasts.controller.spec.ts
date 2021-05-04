import { Test, TestingModule } from '@nestjs/testing';
import { PodcastsController } from './podcasts.controller';

describe('PodcastsController', () => {
  let controller: PodcastsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PodcastsController],
    }).compile();

    controller = module.get<PodcastsController>(PodcastsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
