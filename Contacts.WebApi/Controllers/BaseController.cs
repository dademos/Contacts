using Microsoft.AspNetCore.Mvc;
using System.Net.Mime;

namespace Contacts.WebApi.Controllers
{
    [ApiController]
    [Consumes(MediaTypeNames.Application.Json)]
    [Produces(MediaTypeNames.Application.Json)]
    [Route("api/[controller]")]
    public class BaseController : ControllerBase;
}
