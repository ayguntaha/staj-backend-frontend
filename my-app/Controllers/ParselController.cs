using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using staj.Data;
using staj.Models.Entities;

namespace staj.Controllers
{
    [ApiController]
    [Route("api/Parsel")]
    public class ParselController : Controller
    {
        private readonly ParselDbContext parselDbContext;
        public ParselController(ParselDbContext parselDbContext) { 
            
            this.parselDbContext= parselDbContext;

        }


        [HttpGet]
        public async Task<IActionResult> GetAllParsel()
        {
            return Ok(await parselDbContext.Parseller.ToListAsync());
        }

        [HttpGet]
        [Route("{id:Guid}")]
        [ActionName("GetParselById")]
        public async Task<IActionResult> GetParselById([FromRoute] Guid id)
        {
            var parsel = await parselDbContext.Parseller.FindAsync(id);

            if (parsel == null)
            {
                return NotFound();
            }

            return Ok(parsel);

        }

        [HttpPost]
        public async Task<IActionResult> AddParsel(Parsel parsel)
        {
            parsel.Id= Guid.NewGuid();
            await parselDbContext.Parseller.AddAsync(parsel);
            await parselDbContext.SaveChangesAsync();

            return CreatedAtAction(nameof(GetParselById),new {id = parsel.Id}, parsel);
        }

        [HttpPut]
        [Route("{id:Guid}")]
        public async Task<IActionResult> UpdateParsel([FromRoute] Guid id, [FromBody] Parsel UpdateParsel) {

            var existingParsel = await parselDbContext.Parseller.FindAsync(id);

            if(existingParsel == null)
            {
                return NotFound();
            }
            existingParsel.ilParsel = UpdateParsel.ilParsel;
            existingParsel.ilceParsel = UpdateParsel.ilceParsel;
            existingParsel.mahalleParsel = UpdateParsel.mahalleParsel;
            existingParsel.wkt = UpdateParsel.wkt;


            await parselDbContext.SaveChangesAsync();

            return Ok(existingParsel);
        }


        [HttpDelete]
        [Route("{id:Guid}")]
        public async Task<IActionResult> DeleteParsel([FromRoute] Guid id)
        {
            var existingParsel = await parselDbContext.Parseller.FindAsync(id);

            if (existingParsel == null)
            {
                return NotFound();
            }
            parselDbContext.Parseller.Remove(existingParsel);
            await parselDbContext.SaveChangesAsync();

            return Ok();
        }

    }
}
