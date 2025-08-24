using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;
using chatapp.Data;     
using chatapp.Models;   

public class ChatHub : Hub
{
    private readonly ApplicationDbContext _context;

    public ChatHub(ApplicationDbContext context)
    {
        _context = context;
    }

    public ApplicationDbContext Get_context()
    {
        return _context;
    }

    public async Task SendMessage(string sender, string receiver, string message, ApplicationDbContext _context)
    {
        try
        {
            var time = DateTime.Now.ToString("HH:mm");

            // 1. Send to all (for now; use Users(sender, receiver) later)
            await Clients.All.SendAsync("ReceiveMessage", sender, receiver, message, time);

            // 2. Save message to database
            var chatMessage = new Chatapp
            {
                Employee = sender,
                Session_id = 0,
                Message_sent = message,
                Time = DateTime.Now
            };
            _context.Chatapps.Add(chatMessage);
            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine("SignalR SendMessage Error: " + ex.Message);
            throw;
        }
    }
}








