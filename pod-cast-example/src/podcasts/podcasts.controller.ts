import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';


@Controller('podcasts')
export class PodcastsController {

    // GET /podcasts
    @Get()
    getAllPodCasts() {
        
    }

    // POST /podcasts
    @Post()
    createPodCast() {

    }

    // GET /podcasts/:id
    @Get(':id')
    getPodCastbyID( @Param('id') id: number ) {

    }

    // PATCH /podcasts/:id
    @Patch(':id')
    updatePodCast( @Param('id') id: number ) {

    }

    // DELETE /podcasts/:id
    @Delete(':id')
    deletePodCast( @Param('id') id: number ) {

    }

    // GET /podcasts/:id/episodes
    
    @Get(':id/episodes')
    getEpisodes( @Param('id') id: number) {

    }

    // POST /podcasts/:id/episodes
    @Post(':id/episodes')
    createEpisode( @Param('id') id: number) {

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
