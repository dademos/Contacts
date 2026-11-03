using Bogus;
using Contacts.Common.Exceptions;
using Contacts.Common.Extensions;
using Contacts.Common.Models;
using Contacts.Data.Entities;
using Contacts.Data.Repositories.Interfaces;
using Contacts.Services.Contracts.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Contacts.Services.Services;

internal class ContactService(IContactRepository contactRepository) : IContactService
{
    private readonly IContactRepository _contactRepository = contactRepository;

    public Task<PageResult<Contact>> Search(SortedPageSearchRequest<ContactSortBy> request)
    {
        return _contactRepository.Search(request);
    }

    public async Task<Contact> Create(Contact contact)
    {
        await CheckEmailAndPhone(contact);

        _contactRepository.Add(contact);
        await _contactRepository.SaveChangesAsync();

        return contact;
    }

    public async Task<Contact> Update(Contact contact)
    {
        await CheckEmailAndPhone(contact);
        
        _contactRepository.Update(contact);
        try
        {
            await _contactRepository.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            await CheckExists(contact.Id);
            throw;
        }

        return contact;
    }

    public async Task Delete(long id)
    {
        _contactRepository.Delete(new Contact { Id = id });
        try
        {
            await _contactRepository.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            await CheckExists(id);
            throw;
        }
    }

    public async Task Seed(int count)
    {
        var faker = new Faker<Contact>()
            .RuleFor(p => p.FirstName, f => f.Name.FirstName())
            .RuleFor(p => p.LastName, f => f.Name.LastName().OrNull(f, .1f))
            .RuleFor(p => p.Phone, f => f.Phone.PhoneNumber("04########").OrNull(f, .2f))
            .RuleFor(p => p.Email, (f, p) => p.Phone == null ? f.Internet.Email() : f.Internet.Email().OrNull(f, .2f));

        var contacts = new List<Contact>(count);
        for (var i = 0; i < count; i++)
        {
            contacts.Add(faker.Generate());
        }

        _contactRepository.AddRange(contacts);
        await _contactRepository.SaveChangesAsync();
    }

    private async Task CheckEmailAndPhone(Contact contact)
    {
        if (contact.Email.IsNullOrWhiteSpace() && contact.Phone.IsNullOrWhiteSpace())
        {
            throw new BadRequestException("Contact must have either an email or a phone number.");
        }

        // Uniqueness of email and phone is already enforced on DB level, so here we are just
        // being nice to the consumers by providing a descriptive error message and a
        // more appropriate HTTP status code (409 Conflict) instead of generic 500

        if (contact.Email != null 
            && await _contactRepository.AnyAsync(c => c.Email == contact.Email && c.Id != contact.Id))
        {
            throw new ConflictException($"A contact with email {contact.Email} already exists.");
        }

        if (contact.Phone != null 
            && await _contactRepository.AnyAsync(c => c.Phone == contact.Phone && c.Id != contact.Id))
        {
            throw new ConflictException($"A contact with phone {contact.Phone} already exists.");
        }
    }

    private async Task CheckExists(long id)
    {
        if (!await _contactRepository.AnyAsync(c => c.Id == id))
        {
            throw new NotFoundException($"Contact with id {id} does not exist.");
        }
    }
}
