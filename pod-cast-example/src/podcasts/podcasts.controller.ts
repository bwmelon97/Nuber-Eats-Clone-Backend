import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreatePodcastDTO } from './dtos/create-pod-cast.dto';
import { CreateEpisodeDTO } from './dtos/createEpisodeDTO';
import { UpdatePodcastDTO } from './dtos/updatePodcastDTO';
import { PodcastsService } from './podcasts.service';


@Controller('podcasts')
export class PodcastsController {

    constructor ( private readonly podcastService: PodcastsService ) {}

    // GET /podcasts
    @Get()
    getAllPodCasts() {
        return this.podcastService.getAllPodCasts()
    }

    // GET /podcasts/:id
    @Get(':id')
    getPodCastbyID( @Param('id') id: string ) {
        return this.podcastService.getOnePodCastByID(+id)
    }

    // POST /podcasts
    @Post()
    createPodCast( @Body() createPodcastData: CreatePodcastDTO ) {
        return this.podcastService.createPodCast(createPodcastData)
    }

    // DELETE /podcasts/:id
    @Delete(':id')
    deletePodCast( @Param('id') id: string ) {
        return this.podcastService.deletePodCast(+id)
    }

    // PATCH /podcasts/:id
    @Patch(':id')
    updatePodCast( @Param('id') id: string, @Body() updatePodcastData: UpdatePodcastDTO ) {
        return this.podcastService.updatePodCast(+id, updatePodcastData)
    }

    // GET /podcasts/:id/episodes
    @Get(':id/episodes')
    getEpisodes( @Param('id') id: number) {

    }

    // POST /podcasts/:id/episodes
    @Post(':id/episodes')
    createEpisode( @Param('id') id: string, @Body() createEpisodeData: CreateEpisodeDTO ) {
        return this.podcastService.createEpisode(+id, createEpisodeData)
    }

    // PATCH /podcasts/:id/episodes/:episodeId
    @Patch(':id/episodes')
    updateEpisode( @Param('id') id: number) {

    }

    // DELETE /podcasts/:id/episodes/:episodeId
    @Delete(':id/episodes')
    deleteEpisode( @Param('id') id: number) {

    }
}
