using Contacts.Common.Exceptions;
using Contacts.Data.Entities;
using Contacts.Data.Repositories.Interfaces;
using Contacts.Services.Services;
using Moq;
using Shouldly;
using Microsoft.EntityFrameworkCore;

namespace Contacts.Services.Tests;

public class ContactServiceTests
{
    #region Create

    [Fact]
    public async Task Create_Succeeds_WithValidContact()
    {
        var repo = CreateRepository();
        var contact = new Contact { FirstName = "John", Email = "john@example.com" };
        var sut = new ContactService(repo.Object);

        var result = await sut.Create(contact);

        result.ShouldSatisfyAllConditions(
            () => result.ShouldBe(contact),
            () => repo.Verify(x => x.Add(contact), Times.Once),
            () => repo.Verify(x => x.SaveChangesAsync(), Times.Once));
    }

    [Fact]
    public async Task Create_ThrowsBadRequest_WithoutEmailOrPhone()
    {
        var repo = CreateRepository();
        var contact = new Contact { FirstName = "John" };
        var sut = new ContactService(repo.Object);

        var ex = await Should.ThrowAsync<BadRequestException>(() =>
            sut.Create(contact));

        ex.ShouldSatisfyAllConditions(
            () => ex.Message.ShouldBe("Contact must have either an email or a phone number."),
            () => repo.Verify(x => x.Add(contact), Times.Never),
            () => repo.Verify(x => x.SaveChangesAsync(), Times.Never));
    }

    [Fact]
    public async Task Create_ThrowsConflict_WithDuplicateEmail()
    {
        var repo = CreateRepository();
        var contact = new Contact { FirstName = "John", Email = "john@example.com" };
        repo.Setup(x => x.AnyAsync(It.Is<System.Linq.Expressions.Expression<Func<Contact, bool>>>(predicate =>
                predicate.Compile()(new Contact { Email = contact.Email, Id = 1 }))))
            .ReturnsAsync(true);
        var sut = new ContactService(repo.Object);

        var ex = await Should.ThrowAsync<ConflictException>(() => sut.Create(contact));

        ex.ShouldSatisfyAllConditions(
            () => ex.Message.ShouldBe("A contact with email john@example.com already exists."),
            () => repo.Verify(x => x.Add(contact), Times.Never),
            () => repo.Verify(x => x.SaveChangesAsync(), Times.Never));
    }

    [Fact]
    public async Task Create_ThrowsConflict_WithDuplicatePhone()
    {
        var repo = CreateRepository();
        var contact = new Contact { FirstName = "John", Phone = "1234567890" };
        repo.Setup(x => x.AnyAsync(It.Is<System.Linq.Expressions.Expression<Func<Contact, bool>>>(predicate =>
                predicate.Compile()(new Contact { Phone = contact.Phone, Id = 1 }))))
            .ReturnsAsync(true);
        var sut = new ContactService(repo.Object);

        var ex = await Should.ThrowAsync<ConflictException>(() => sut.Create(contact));

        ex.ShouldSatisfyAllConditions(
            () => ex.Message.ShouldBe("A contact with phone 1234567890 already exists."),
            () => repo.Verify(x => x.Add(contact), Times.Never),
            () => repo.Verify(x => x.SaveChangesAsync(), Times.Never));
    }

    #endregion

    #region Update

    [Fact]
    public async Task Update_Succeeds_WithValidContact()
    {
        var repo = CreateRepository();
        var contact = new Contact { Id = 1, FirstName = "John", Email = "john@example.com" };
        var sut = new ContactService(repo.Object);

        var result = await sut.Update(contact);

        result.ShouldSatisfyAllConditions(
            () => result.ShouldBeSameAs(contact),
            () => repo.Verify(x => x.Update(contact), Times.Once),
            () => repo.Verify(x => x.SaveChangesAsync(), Times.Once));
    }

    [Fact]
    public async Task Update_ThrowsBadRequest_WithoutEmailOrPhone()
    {
        var repo = CreateRepository();
        var contact = new Contact { Id = 1, FirstName = "John" };
        var sut = new ContactService(repo.Object);

        var ex = await Should.ThrowAsync<BadRequestException>(() =>
            sut.Update(contact));

        ex.ShouldSatisfyAllConditions(
            () => ex.Message.ShouldBe("Contact must have either an email or a phone number."),
            () => repo.Verify(x => x.Update(contact), Times.Never),
            () => repo.Verify(x => x.SaveChangesAsync(), Times.Never));
    }

    [Fact]
    public async Task Update_ThrowsConflict_WithDuplicateEmail()
    {
        var repo = CreateRepository();
        var contact = new Contact { Id = 1, FirstName = "John", Email = "john@example.com" };
        repo.Setup(x => x.AnyAsync(It.Is<System.Linq.Expressions.Expression<Func<Contact, bool>>>(predicate =>
                predicate.Compile()(new Contact { Email = contact.Email, Id = 2 }))))
            .ReturnsAsync(true);
        var sut = new ContactService(repo.Object);

        var ex = await Should.ThrowAsync<ConflictException>(() => sut.Update(contact));

        ex.ShouldSatisfyAllConditions(
            () => ex.Message.ShouldBe("A contact with email john@example.com already exists."),
            () => repo.Verify(x => x.Update(contact), Times.Never),
            () => repo.Verify(x => x.SaveChangesAsync(), Times.Never));
    }

    [Fact]
    public async Task Update_ThrowsConflict_WithDuplicatePhone()
    {
        var repo = CreateRepository();
        var contact = new Contact { Id = 1, FirstName = "John", Phone = "1234567890" };
        repo.Setup(x => x.AnyAsync(It.Is<System.Linq.Expressions.Expression<Func<Contact, bool>>>(predicate =>
                predicate.Compile()(new Contact { Phone = contact.Phone, Id = 2 }))))
            .ReturnsAsync(true);
        var sut = new ContactService(repo.Object);

        var ex = await Should.ThrowAsync<ConflictException>(() => sut.Update(contact));

        ex.ShouldSatisfyAllConditions(
            () => ex.Message.ShouldBe("A contact with phone 1234567890 already exists."),
            () => repo.Verify(x => x.Update(contact), Times.Never),
            () => repo.Verify(x => x.SaveChangesAsync(), Times.Never));
    }

    [Fact]
    public async Task Update_ThrowsNotFound_ForMissingContact()
    {
        var repo = CreateRepository();
        var contact = new Contact { Id = 1, FirstName = "John", Email = "john@example.com" };
        repo.Setup(x => x.SaveChangesAsync()).ThrowsAsync(new DbUpdateConcurrencyException());
        var sut = new ContactService(repo.Object);

        var ex = await Should.ThrowAsync<NotFoundException>(() => sut.Update(contact));

        ex.ShouldSatisfyAllConditions(
            () => ex.Message.ShouldBe("Contact with id 1 does not exist."),
            () => repo.Verify(x => x.Update(contact), Times.Once),
            () => repo.Verify(x => x.SaveChangesAsync(), Times.Once));
    }

    [Fact]
    public async Task Update_ThrowsConcurrency_WhenContactExists()
    {
        var repo = CreateRepository();
        var contact = new Contact { Id = 1, FirstName = "John", Email = "john@example.com" };
        var concurrencyEx = new DbUpdateConcurrencyException();
        repo.Setup(x => x.AnyAsync(It.Is<System.Linq.Expressions.Expression<Func<Contact, bool>>>(predicate =>
                predicate.Compile()(contact))))
            .ReturnsAsync(true);
        repo.Setup(x => x.SaveChangesAsync()).ThrowsAsync(concurrencyEx);
        var sut = new ContactService(repo.Object);

        var ex = await Should.ThrowAsync<DbUpdateConcurrencyException>(() => sut.Update(contact));

        ex.ShouldSatisfyAllConditions(
            () => ex.ShouldBe(concurrencyEx),
            () => repo.Verify(x => x.Update(contact), Times.Once),
            () => repo.Verify(x => x.SaveChangesAsync(), Times.Once));
    }

    #endregion

    #region Delete

    [Fact]
    public async Task Delete_Succeeds()
    {
        var repo = CreateRepository();
        const long id = 1;
        var sut = new ContactService(repo.Object);

        await sut.Delete(id);

        repo.ShouldSatisfyAllConditions(
            () => repo.Verify(x => x.Delete(It.Is<Contact>(contact => contact.Id == id)), Times.Once),
            () => repo.Verify(x => x.SaveChangesAsync(), Times.Once));
    }

    [Fact]
    public async Task Delete_ThrowsNotFound_ForMissingContact()
    {
        var repo = CreateRepository();
        const long id = 1;
        repo.Setup(x => x.SaveChangesAsync()).ThrowsAsync(new DbUpdateConcurrencyException());
        var sut = new ContactService(repo.Object);

        var ex = await Should.ThrowAsync<NotFoundException>(() => sut.Delete(id));

        ex.ShouldSatisfyAllConditions(
            () => ex.Message.ShouldBe("Contact with id 1 does not exist."),
            () => repo.Verify(x => x.Delete(It.Is<Contact>(contact => contact.Id == id)), Times.Once),
            () => repo.Verify(x => x.SaveChangesAsync(), Times.Once));
    }

    [Fact]
    public async Task Delete_ThrowsConcurrency_WhenContactExists()
    {
        var repo = CreateRepository();
        const long id = 1;
        var concurrencyEx = new DbUpdateConcurrencyException();
        repo.Setup(x => x.AnyAsync(It.Is<System.Linq.Expressions.Expression<Func<Contact, bool>>>(predicate =>
                predicate.Compile()(new Contact { Id = id })))).ReturnsAsync(true);
        repo.Setup(x => x.SaveChangesAsync()).ThrowsAsync(concurrencyEx);
        var sut = new ContactService(repo.Object);

        var ex = await Should.ThrowAsync<DbUpdateConcurrencyException>(() => sut.Delete(id));

        ex.ShouldSatisfyAllConditions(
            () => ex.ShouldBe(concurrencyEx),
            () => repo.Verify(x => x.Delete(It.Is<Contact>(contact => contact.Id == id)), Times.Once),
            () => repo.Verify(x => x.SaveChangesAsync(), Times.Once));
    }

    #endregion

    #region Seed

    [Fact]
    public async Task Seed_CreatesSpecifiedNumberOfContactsWithEmailOrPhone()
    {
        const int count = 50;
        var repo = CreateRepository();
        List<Contact>? contacts = null;
        repo.Setup(x => x.AddRange(It.Is<IEnumerable<Contact>>(items => true)))
            .Callback<IEnumerable<Contact>>(items => contacts = [.. items]);
        var sut = new ContactService(repo.Object);

        await sut.Seed(count);

        contacts.ShouldSatisfyAllConditions(
            () => contacts.ShouldNotBeNull(),
            () => contacts!.Count.ShouldBe(count),
            () => contacts!.ShouldAllBe(contact => contact.Email != null || contact.Phone != null),
            () => repo.Verify(x => x.SaveChangesAsync(), Times.Once));
    }

    #endregion

    private static Mock<IContactRepository> CreateRepository()
    {
        return new Mock<IContactRepository>();
    }
}