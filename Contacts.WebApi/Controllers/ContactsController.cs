using System.ComponentModel.DataAnnotations;
using Contacts.Common.Models;
using Contacts.Services.Contracts.Interfaces;
using Contacts.WebApi.Models;
using Contacts.WebApi.Models.Contacts;
using Microsoft.AspNetCore.Mvc;

namespace Contacts.WebApi.Controllers
{
    public class ContactsController(IContactService contactService, ApiMapper mapper) : BaseController
    {
        private readonly IContactService _contactService = contactService;
        private readonly ApiMapper _mapper = mapper;
        // Introduce artificial delay to API responses for the purposes of demoing loading states in the frontend
        private const int _demoDelay = 500;

        [HttpPost("Search")]
        public async Task<PageResult<ContactResponse>> Search(SortedPageSearchRequest<ContactSortBy> request)
        {
            var page = await _contactService.Search(request);

            var response = _mapper.MapPageResult(page);

            await Task.Delay(_demoDelay);

            return response;
        }

        [HttpPost]
        public async Task<ContactResponse> Create(CreateContactRequest request)
        {
            var contact = _mapper.FromAddRequest(request);

            await _contactService.Create(contact);

            await Task.Delay(_demoDelay);

            return _mapper.ToResponse(contact);
        }

        [HttpPut]
        public async Task<ContactResponse> Update(UpdateContactRequest request)
        {
            var contact = _mapper.FromUpdateRequest(request);

            await _contactService.Update(contact);
            
            await Task.Delay(_demoDelay);
            
            return _mapper.ToResponse(contact);
        }

        [HttpDelete("{id}")]
        public async Task Delete([Range(1, long.MaxValue, ErrorMessage = "The field id must be positive.")] long id)
        {
            await Task.Delay(_demoDelay);

            await _contactService.Delete(id);
        }

        [HttpPost("Seed/{count}")]
        public async Task Seed([Range(1, 50)] int count)
        {
            await Task.Delay(_demoDelay);

            await _contactService.Seed(count);
        }
    }
}
